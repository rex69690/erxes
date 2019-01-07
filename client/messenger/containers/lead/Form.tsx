import gql from "graphql-tag";
import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { Form as DumbForm } from "../../../form/components";
import { ICurrentStatus, IForm, IFormDoc } from "../../../form/types";
import { IEmailParams, IIntegration } from "../../../types";
import queries from "../../graphql";
import { LeadConsumer, LeadProvider } from "./LeadContext";

const Form = (props: ChildProps<IProps, QueryResponse>) => {
  const data = props.data;

  if (!data || data.loading) {
    return null;
  }

  if (!data.form || !(data.form.title || "").trim()) {
    return null;
  }

  const extendedProps = {
    ...props,
    form: data.form
  };

  return <DumbForm {...extendedProps} hasTopBar={false} />;
};

type QueryResponse = {
  form: IForm;
};

interface IProps {
  integration: IIntegration;
  form: IForm;
  currentStatus: ICurrentStatus;
  onSubmit: (doc: IFormDoc) => void;
  onCreateNew: () => void;
  sendEmail: (params: IEmailParams) => void;
}

const FormWithData = graphql<IProps, QueryResponse>(gql(queries.formQuery), {
  options: ({ form }) => ({
    fetchPolicy: "network-only",
    variables: {
      formId: form._id
    }
  })
})(Form);

const WithContext = () => (
  <LeadProvider>
    <LeadConsumer>
      {({
        currentStatus,
        save,
        createNew,
        sendEmail,
        getIntegration,
        getForm
      }) => {
        const integration = getIntegration();
        const form = getForm();

        return (
          <FormWithData
            currentStatus={currentStatus}
            onSubmit={save}
            onCreateNew={createNew}
            sendEmail={sendEmail}
            form={form}
            integration={integration}
          />
        );
      }}
    </LeadConsumer>
  </LeadProvider>
);

export default WithContext;
