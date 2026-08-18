import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
       title="ronak-advertising"
        description="Build a bigger presence Across the city"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
