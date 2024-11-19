import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { useAuth } from "../context/AuthContext";

const LinkAccountModal = ({ open, handleClose }) => {
  const { handleLinkAnonymousAccount } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLink = async () => {
    try {
      setError("");
      setSuccess("");
      await handleLinkAnonymousAccount(email, password);
      setSuccess("Account linked successfully!");
      handleClose(); // Close the modal on success
    } catch (error) {
      setError("Failed to link account: " + error.message);
    }
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <DialogHeader>¡Registrate para mejor experiencia!</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="gradient" onClick={handleLink}>
          Crear cuenta
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default LinkAccountModal;
