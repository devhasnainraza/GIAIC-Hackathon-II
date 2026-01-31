"""Tag API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.schemas.tag import TagCreateRequest, TagUpdateRequest, TagResponse
from src.services.tag_service import TagService
from src.api.deps import get_current_user
from src.models.user import User

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=List[TagResponse])
async def list_tags(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tags for the authenticated user.

    Args:
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        List of TagResponse objects for the user's tags
    """
    service = TagService(session)
    tags = service.list_tags(current_user.id)

    # Add task count to each tag
    result = []
    for tag in tags:
        task_count = service.get_tag_task_count(tag.id, current_user.id)
        tag_dict = tag.model_dump()
        tag_dict['task_count'] = task_count
        result.append(TagResponse(**tag_dict))

    return result


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new tag for the authenticated user.

    Args:
        tag_data: Tag creation data (name, color)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TagResponse with created tag data
    """
    service = TagService(session)
    tag = service.create_tag(
        user_id=current_user.id,
        name=tag_data.name,
        color=tag_data.color or "#3370ff"
    )

    tag_dict = tag.model_dump()
    tag_dict['task_count'] = 0
    return TagResponse(**tag_dict)


@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag(
    tag_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific tag by ID.

    Args:
        tag_id: ID of the tag to retrieve
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TagResponse with tag data
    """
    service = TagService(session)
    tag = service.get_tag(tag_id, current_user.id)

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found"
        )

    task_count = service.get_tag_task_count(tag.id, current_user.id)
    tag_dict = tag.model_dump()
    tag_dict['task_count'] = task_count
    return TagResponse(**tag_dict)


@router.patch("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: int,
    tag_data: TagUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update an existing tag.

    Args:
        tag_id: ID of the tag to update
        tag_data: Tag update data (name, color)
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        TagResponse with updated tag data
    """
    service = TagService(session)
    tag = service.update_tag(
        tag_id=tag_id,
        user_id=current_user.id,
        name=tag_data.name,
        color=tag_data.color
    )

    task_count = service.get_tag_task_count(tag.id, current_user.id)
    tag_dict = tag.model_dump()
    tag_dict['task_count'] = task_count
    return TagResponse(**tag_dict)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a tag.

    Args:
        tag_id: ID of the tag to delete
        current_user: Authenticated user (from JWT token)
        session: Database session

    Returns:
        No content (204 status)
    """
    service = TagService(session)
    service.delete_tag(tag_id, current_user.id)
    return None
