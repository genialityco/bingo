import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useAuth } from "../context/AuthContext";


export function DialogForName() {
  const [open, setOpen] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const { user, setUser, userName, handleLoginAnonymously } = useAuth();

  useEffect(() => {
    if (user && userName) {
      setOpen(false);
    } else if (!user && !userName) {
      setOpen(true);
    }
  }, [user, userName]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!user) {
      const newUser = await handleLoginAnonymously(displayName);
      if (newUser) {
        setUser(newUser);
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} size="xs">
      <DialogBody>
        <form onSubmit={handleLogin}>
          <Typography variant="h6" color="blue-gray">
            Ingrese su nombre
          </Typography>
          <Input
            label="Nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button type="submit" variant="gradient" color="gray">
              Entrar
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
}
