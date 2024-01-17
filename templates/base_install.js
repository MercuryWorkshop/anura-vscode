export default async function install(anura) {
  (
    await import(
      import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) +
        "/versions/${LATEST_VERSION}-install.js"
    )
  ).default(anura);
}
