import mongoose from "mongoose";
import { app } from "./app.js";
const PORT = process.env.PORT || 3000;
async function main() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/sft-miniapp"
  );
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();
