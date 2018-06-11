export enum PlayerEventType {
    PlayingChange = "PLAYING.CHANGE",
    PlayerAttached= "PLAYER.ATTACHED",
    PlayerDetached = "PLAYER.DETACHED",
    ContentLoaded = "CONTENT.LOADED",
}

export enum SettingsEventType {
    UpdateRequest = "SETTINGS.UPDATE.REQUEST",
    UpdateSuccess = "SETTINGS.UPDATE.SUCCESS",
    UpdateFailed = "SETTINGS.UPDATE.FAILED",
}

export enum MarkerEventType {
    AddFormDisplay ="MARKER.FORM.ADD.DISPLAY",
    EditFormDisplay ="MARKER.FORM.EDIT.DISPLAY",
    AddRequest = "MARKER.ADD.REQUEST",
    AddSuccess = "MARKER.ADD.SUCCESS",
    AddFailed = "MARKER.ADD.FAILED",
    UpdateRequest = "MARKER.UPDATE.REQUEST",
    UpdateSuccess = "MARKER.UPDATE.SUCCESS",
    UpdateFailed = "MARKER.UPDATE.FAILED",
    DeleteRequest = "MARKER.DELETE.REQUEST",
    DeleteSuccess = "MARKER.DELETE.SUCCESS",
    DeleteFailed = "MARKER.DELETE.FAILED",
}
