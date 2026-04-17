process.env.VERCEL = "1";
import("./admin/admin.js")
  .then(() => {
    console.log("ADMIN_IMPORT_OK");
  })
  .catch((error) => {
    console.log("ADMIN_IMPORT_ERR");
    console.log(error && error.message ? error.message : String(error));
    process.exit(1);
  });
