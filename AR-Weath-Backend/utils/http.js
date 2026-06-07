export const handleDatabaseError = (res, error) => {
  console.error(error);
  return res
    .status(500)
    .json({ error: error.message || "Internal server error" });
};
