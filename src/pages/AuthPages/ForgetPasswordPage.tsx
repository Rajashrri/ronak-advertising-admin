import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import ResetPassword from "../../components/auth/ResetPassword";
import ForgetPassword from "../../components/auth/ForgetPassword";

export default function ForgetPasswordPage() {
  return (
    <>
      <PageMeta
      title="ronak-advertising"
        description="Build a bigger presence Across the city"  
       />
      <AuthLayout>
        <ForgetPassword />
      </AuthLayout>
    </>
  );
}
