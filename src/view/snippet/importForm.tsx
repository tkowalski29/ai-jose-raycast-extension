import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { v4 as uuidv4 } from "uuid";
import {
  ClearImportModel,
  ClearImportModelTemperature,
  ConfigurationModelCollection,
  ConfigurationModelDefault,
  ConfigurationTypeCommunicationDefault,
} from "../../type/config";
import { SnippetDefaultTemperature, SnippetHookType } from "../../type/snippet";
import { TalkSnippetType } from "../../type/talk";

export const SnippetImportForm = (props: { use: { snippets: SnippetHookType } }) => {
  const { use } = props;
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<{ json: string }>({
    onSubmit: async (data: { json: string }) => {
      JSON.parse(data.json).map((item: any) => {
        let iModel = ClearImportModel(item.model);
        if (!ConfigurationModelCollection.some((model) => model.key === iModel)) {
          iModel = ConfigurationModelDefault;
        }

        const newAssistant: TalkSnippetType = {
          snippetId: uuidv4(),
          title: item.title,
          category: "new",
          emoji: item.icon,
          model: iModel,
          modelTemperature: ClearImportModelTemperature(item.creativity, SnippetDefaultTemperature),
          promptSystem: item.prompt,
          webhookUrl: undefined,
          isLocal: false,
          typeCommunication: ConfigurationTypeCommunicationDefault,
        };

        use.snippets.add({ ...newAssistant });
      });
      pop();
    },
    validation: {
      json: FormValidation.Required,
    },
  });

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Submit" icon={Icon.SaveDocument} onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextArea
          id="json"
          title="Json string"
          placeholder='[{"name": "...", "instructions": "..."}]'
          info="Json string from https://prompts.ray.so/code"
        />
      </Form>
    </>
  );
};
