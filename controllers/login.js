

export const login = (req, res) => {
  const { email, password } = req.body;

  if (email === "elbaraka@demo.dz" && password === "demo1234") {
    return res.json({
      token: "demo-token",
      shopName: "Épicerie El Baraka",
    });
  }

  res.status(401).json({ message: "Email ou mot de passe incorrect" });
};