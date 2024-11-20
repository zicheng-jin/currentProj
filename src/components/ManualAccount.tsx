import {
  Button,
  FlexLayout,
  FormField,
  FormFieldHelperText,
  FormFieldLabel,
  H2,
  Input,
  RadioButton,
  RadioButtonGroup,
  Panel,
  H4,
  Link,
  Text,
} from "@salt-ds/core";
import " .. /styles/ManualAccount.css";

const ManualAccount = () => {
  return (
    <>
      <FlexLayout
        direction="column"
        className="manual-connect-container"
        gap="15px"
      >
        <H2>Manually conncet your account</H2>
        <FormField>
          <FormFieldLabel>Email address</FormFieldLabel>
          <Input bordered />
        </FormField>
        <FormField>
          <FormFieldLabel>Name on account</FormFieldLabel>
          <Input bordered />
        </FormField>
        <FormField>
          <FormFieldLabel>Account type</FormFieldLabel>
          <RadioButtonGroup direction="horizontal">
            <RadioButton label="Checking" value="checking" />
            <RadioButton label="Saving" value="saving" />
          </RadioButtonGroup>
        </FormField>
        <FormField validationStatus={"success"}>
          <FormFieldLabel>Routing number</FormFieldLabel>
          <Input bordered defaultValue="1111111111111" />
          <FormFieldHelperText>JPMorgan Chase Bank, NA. </FormFieldHelperText>
        </FormField>
        <RoutingBanner />
        <FormField>
          <FormFieldLabel>Account number</FormFieldLabel>
          <Input bordered />
        </FormField>
        <FormField>
          <FormFieldLabel>Confirm account number</FormFieldLabel>
          <Input bordered />
        </FormField>
      </FlexLayout>
      <div className="manual-connect-continue-container">
        <Button
          sentiment="accented"
          appearance="solid"
          className="manual-connect-continue"
        >
          CONTINUE
        </Button>
      </div>
    </>
  );
};

const RoutingBanner = () => {
  return (
    <Panel variant="secondary" className="manual-connect-routing-panel">
      <FlexLayout align="center" gap="10px">
        <img
          src="/static/img/JP-Morgan-Chase-Symbol.png"
          className="manual-connect-bank-logo"
          alt="bank-logo"
        />
        <div>
          <H4 className="manual-connect-bank-name">JPMorgan Chase</H4>
          <Text>www.chase.com</Text>
        </div>
      </FlexLayout>
      <Text className="manual-connect-bank-copy">
        We see you're trying to connect a Chase account. You can use a fast,
        simple, secure way to authenticate your bank.
      </Text>
      <Link href="#">Connect instantly</Link>
    </Panel>
  );
};

export default ManualAccount;
