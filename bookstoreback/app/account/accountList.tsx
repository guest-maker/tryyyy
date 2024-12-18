'use client';
import { useEffect, useState } from "react";
import { Box, Container, List, ListItemButton, ListItemText, Typography, Fab, IconButton } from "@mui/material";
import AccountAdd from "./accountAdd";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";

type Account = {
  username: string;
  password: string;
  level: number;
};

export default function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]); // Explicitly define the type of accounts
  const [proProp, setProProp] = useState({
    visible: false,
    account: { username: "", password: "", level: 0 },
  });

  // Get all accounts
  async function getAccounts() {
    try {
      const response = await axios.get('http://localhost:8000/admin/users/');
      setAccounts(() => [...response.data]); // Update state with fetched data
    } catch (error) {
      console.error(error);
    }
  }

  // Delete account
  const handleDelete = async (account: string) => {
    try {
      await axios.delete(`http://localhost:8000/admin/users/${account}`);
      setAccounts(accounts.filter(acc => acc.username !== account)); // Remove deleted account from the state
    } catch (error) {
      console.error(error);
    }
  };

  // Update account details or show the form with null data for a new account
  const show = (account: Account | null) => {
    if (account) {
      setProProp({
        visible: true,
        account: {
          username: account.username,
          password: account.password,
          level: account.level,
        },
      });
    } else {
      setProProp({
        visible: true,
        account: { username: "", password: "", level: 0 },
      });
    }
  };

  useEffect(() => {
    getAccounts();
  }, [proProp.visible]);

  return (
    <Container maxWidth="md">
      {!proProp.visible ? (
        <Box>
          <List>
            {accounts.map((account) => (
              <ListItemButton
                key={account.username}
                sx={{ padding: '12px 16px' }} // Adjust height of each list item
              >
                <Box>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{account.username}</Typography>}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{account.password}</Typography>}
                  />
                </Box>
                <Box>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{account.level}</Typography>}
                  />
                </Box>
                <IconButton edge="end" aria-label="delete" onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  handleDelete(account.username);
                }} sx={{ zIndex: 1 }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end" aria-label="edit" onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  show(account);
                }} sx={{ zIndex: 1 }}>
                  <EditIcon />
                </IconButton>
              </ListItemButton>
            ))}
          </List>

          <Fab
            color="primary"
            aria-label="add"
            onClick={() => show(null)} // Passing null to clear the form
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      ) : (
        <AccountAdd proProp={proProp} setProProp={setProProp} />
      )}
    </Container>
  );
}
