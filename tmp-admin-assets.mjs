import { Router as AdminRouter } from "adminjs";
for (const a of (AdminRouter.assets || [])) {
  console.log(a.path + " => " + a.src);
}
