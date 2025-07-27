import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { getAllUsers } from "../utils/user";


const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#181818", paper: "#23272f" },
  },
});

const providers = [
  { id: "credentials", name: "Username & Password" }
];

export default function Login() {
  const navigate = useNavigate();


  const signIn = async (provider: any, formData: FormData) => {
    if (provider.id === "credentials") {
      
      const username = (formData.get("email") as string || "").trim();
      const password = (formData.get("password") as string || "").trim();

      const users = getAllUsers();

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("currentUser", user.username);
        navigate("/", { replace: true });
        return {};
      }

      return { error: "Invalid username or password." };
    }

    return { error: "Unsupported provider." };
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: true }
        }}
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#181818',
          '& .MuiStack-root': {
            alignItems: 'center',
            margin: '0 auto',
            width: '100%',
            maxWidth: 400,
            boxSizing: 'border-box',
            '@media (min-width:1200px)': {
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
            },
          },
        }}
      />
    </AppProvider>
  );
}
