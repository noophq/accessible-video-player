export enum LanguageType {
    Default = "DEFAULT",
    AudioDescription = "AUDIO_DESCRIPTION",
    CuedSpeech = "CUED_SPEECH",
    SignedLanguage = "SIGNED_LANGUAGE",
}

export interface LanguageSettings {
    type: LanguageType,
}
