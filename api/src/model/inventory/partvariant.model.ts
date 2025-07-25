import db from "../../db/client.js";

export async function getAllPartVariants() {
  const result = await db.query(`SELECT * FROM part_variant`);
  return result.rows;
}
