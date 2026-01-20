04:00:04.676 Running build in Washington, D.C., USA (East) – iad1
04:00:04.676 Build machine configuration: 2 cores, 8 GB
04:00:04.806 Cloning github.com/devhasnainraza/GIAIC-Hackathon-II (Branch: 004-ui-ux-branding, Commit: deccda8)
04:00:04.807 Previous build caches not available.
04:00:05.067 Cloning completed: 260.000ms
04:00:05.576 Running "vercel build"
04:00:07.097 Vercel CLI 50.4.8
04:00:07.757 Installing dependencies...
04:00:21.555 
04:00:21.556 added 380 packages in 14s
04:00:21.556 
04:00:21.556 150 packages are looking for funding
04:00:21.556   run `npm fund` for details
04:00:21.635 Running "npm run build"
04:00:21.737 
04:00:21.737 > frontend@0.1.0 build
04:00:21.737 > next build
04:00:21.737 
04:00:22.348 Attention: Next.js now collects completely anonymous telemetry regarding usage.
04:00:22.349 This information is used to shape Next.js' roadmap and prioritize features.
04:00:22.350 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
04:00:22.350 https://nextjs.org/telemetry
04:00:22.350 
04:00:22.368 ▲ Next.js 16.1.1 (Turbopack)
04:00:22.369 - Experiments (use with caution):
04:00:22.370   · optimizePackageImports
04:00:22.370 
04:00:22.372 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
04:00:22.401   Creating an optimized production build ...
04:00:32.045 ✓ Compiled successfully in 9.3s
04:00:32.047   Running TypeScript ...
04:00:39.682 Failed to compile.
04:00:39.682 
04:00:39.682 ./components/auth/ForgotPasswordForm.tsx:132:11
04:00:39.682 Type error: Type '{ id: string; name: string; type: "email"; label: string; value: string; onChange: (value: string) => void; error: string | undefined; placeholder: string; required: true; autoComplete: string; disabled: boolean; icon: Element; }' is not assignable to type 'IntrinsicAttributes & InputProps'.
04:00:39.683   Property 'icon' does not exist on type 'IntrinsicAttributes & InputProps'.
04:00:39.683 
04:00:39.683 [0m [90m 130 |[39m           autoComplete[33m=[39m[32m"email"[39m
04:00:39.683  [90m 131 |[39m           disabled[33m=[39m{isSubmitting}
04:00:39.683 [31m[1m>[22m[39m[90m 132 |[39m           icon[33m=[39m{[33m<[39m[33mMail[39m className[33m=[39m[32m"w-5 h-5 text-slate-400"[39m [33m/[39m[33m>[39m}
04:00:39.683  [90m     |[39m           [31m[1m^[22m[39m
04:00:39.683  [90m 133 |[39m         [33m/[39m[33m>[39m
04:00:39.683  [90m 134 |[39m
04:00:39.683  [90m 135 |[39m         {[90m/* Submit Button */[39m}[0m
04:00:39.718 Next.js build worker exited with code: 1 and signal: null
04:00:39.756 Error: Command "npm run build" exited with 1