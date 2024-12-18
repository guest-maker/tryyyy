import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "axios";

type Account = {
  username: string;
  password: string;
  level: number;
};

type ProProp = {
  visible: boolean;
  account: Account;
};

type Prop = {
  proProp: ProProp;
  setProProp: (s: ProProp) => void;
};

export default function AccountAdd(props: Prop) {
  const title = props.proProp.account.username ? "修改" : "新增";
  const [newAccount, setNewAccount] = useState(props.proProp.account);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
  };


  // 處理新增或修改帳號
  async function update() {
    const payload = { ...newAccount };

    // 上傳帳號資料
    if (props.proProp.account.username) {
      // 修改
      await axios.put(`http://localhost:8000/admin/users/${props.proProp.account.username}`, payload);

    } else {
      // 新增
      await axios.post("http://localhost:8000/admin/users", payload);
    }
    props.setProProp({ ...props.proProp, visible: false });
  }

  const hide = () => {
    props.setProProp({ ...props.proProp, visible: false });
  };

  return (
    <Dialog open={props.proProp.visible} onClose={hide} aria-labelledby={title + "帳號"}>
      <DialogTitle>
        {title}帳號
        <IconButton
          aria-label="close"
          onClick={hide}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField label="帳號" variant="outlined" type="text" name="username" value={newAccount.username} onChange={handleClick} fullWidth margin="normal" />
        <TextField label="密碼" variant="outlined" type="text" name="password" value={newAccount.password} onChange={handleClick} fullWidth margin="normal" />
        <TextField label="密碼" variant="outlined" type="text" name="level" value={newAccount.level} onChange={handleClick} fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={update}>
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
