import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DefaultLayout from "@/layouts/defaultLayout";
import { useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {

  const userRedux = useAppSelector((state) => state.userReduser.value);
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      {/* Hero */}
      <div className="bg-secondary h-[20rem] flex items-center justify-center text-center p-[4%]">
        <h1 className="text-4xl font-bold">Example</h1>
      </div>
      <Card>
        <CardHeader>
          {
            userRedux.userData != undefined ? (
              <>
                <CardTitle>Welcome back, {userRedux.userData.userEmail}!</CardTitle>
                <Button className="mt-4 w-full md:w-fit" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
              </>
            ) : (
              <>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>It looks like you haven't logged in yet. Login to get started.</CardDescription>
                <Button className="mt-4 w-full md:w-fit" onClick={() => navigate("/login")}>Login</Button>
              </>
            )
          }
        </CardHeader>
      </Card>
    </DefaultLayout>
  )
}

export default LandingPage;