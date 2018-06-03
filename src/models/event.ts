export enum PlayerEventType {
    PlayingChange = "playing.change",
    PlayerAttached= "player.attached",
    PlayerDetached = "player.detached",
    ContentAttached = "content.attached",
    ContentDetached = "content.detached",
    ContentLoaded = "content.loaded",
    UiRefreshRequest = "ui.refresh.request",
    UiRefreshSuccess = "ui.refresh.success"
}

export enum SettingsEventType {
    UpdateRequest = "settings.update.request",
    UpdateSuccess = "settings.update.success",
    UpdateFailed = "settings.update.failed",
}

export enum MarkerEventType {
    AddRequest = "marker.add.request",
    AddSuccess = "marker.add.success",
    AddFailed = "marker.add.failed",
    UpdateRequest = "marker.update.request",
    UpdateSuccess = "marker.update.success",
    UpdateFailed = "marker.update.failed",
    RemoveRequest = "marker.remove.request",
    RemoveSuccess = "marker.remove.success",
    RemoveFailed = "marker.remove.failed",
}
