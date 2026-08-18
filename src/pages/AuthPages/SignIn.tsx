import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
       title="ronak-advertising"
        description="Build a bigger presence Across the city"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
