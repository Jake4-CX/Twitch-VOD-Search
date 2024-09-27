import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import DefaultLayout from "@/layouts/defaultLayout";
import { useAppSelector } from "@/redux/store";

const DashboardPage: React.FC = () => {

  const userRedux = useAppSelector((state) => state.userReduser.value);
  const userRole = userRedux.userData?.userRole;

  return (
    <DefaultLayout>
      <Card className="w-full h-[32rem] mt-[4%]">
        <CardHeader>
          <CardTitle>LWS Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Welcome back, {userRedux.userData?.userEmail}!
            You are currently logged in as a {userRole} user.
          </CardDescription>
        </CardContent>
      </Card>
    </DefaultLayout>
  )
}


export default DashboardPage;