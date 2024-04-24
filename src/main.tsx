import "./main.scss";

window.onload = async () => {
  const entry = await import("./entry");
  await entry.runApp();
};
