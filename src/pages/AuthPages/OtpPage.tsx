import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Otp from "../../components/auth/Otp";

export default function OtpPage() {
  return (
    <>
      <PageMeta
      title="ronak-advertising"
        description="Build a bigger presence Across the city" 
      />
      <AuthLayout>
        <Otp />
      </AuthLayout>
    </>
  );
}
