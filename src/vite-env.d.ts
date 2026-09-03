/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Web3Forms access key, which relays the About page's contact thread to the
   * inbox in THREAD_INBOX. Get one by entering that address at web3forms.com;
   * they mail the key back.
   *
   * Public by design — it only authorises posting to that one address, so it is
   * safe in a client bundle and there is no server of our own to run.
   *
   * Local: put it in `.env.local` (gitignored) as VITE_WEB3FORMS_KEY=...
   * Production: add the same name and value in Vercel's environment variables,
   * then redeploy, since Vite inlines it at build time.
   *
   * Leave it unset and the thread still works: it falls back to handing the
   * exchange to the visitor's own mail client as a prefilled mailto.
   */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
