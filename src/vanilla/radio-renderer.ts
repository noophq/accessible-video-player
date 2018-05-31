import radioGroupView from "ejs-loader!lib/vanilla/views/radio-group.ejs";

export interface RadioItem {
    label: string;
    id: string;
    value: string;
}

export function renderRadioGroup(formId: any, inputName: any, radioItems: any) {
    return radioGroupView({formId, inputName, radioItems});
}
