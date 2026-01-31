"""Add newsletter subscribers table

Revision ID: add_newsletter_subscribers
Revises:
Create Date: 2026-01-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_newsletter_subscribers'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create newsletter_subscribers table."""
    op.create_table(
        'newsletter_subscribers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('subscribed_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('unsubscribed_at', sa.DateTime(), nullable=True),
        sa.Column('verification_token', sa.String(length=255), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_newsletter_subscribers_email'), 'newsletter_subscribers', ['email'], unique=True)


def downgrade() -> None:
    """Drop newsletter_subscribers table."""
    op.drop_index(op.f('ix_newsletter_subscribers_email'), table_name='newsletter_subscribers')
    op.drop_table('newsletter_subscribers')
