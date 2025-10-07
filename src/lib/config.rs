use serde::Deserialize;
use std::error::Error;

#[derive(Debug, Deserialize)]
struct Meeting {
    id: u32,
    title: String,
    presenter: String,
    date: String,
    description: String,
    room: String,
}

#[derive(Debug, Deserialize)]
struct MeetingsConfig {
    meetings: Vec<Meeting>,
}

async fn load_meetings_config() -> Result<MeetingsConfig, Box<dyn Error>> {
    let response_text = reqwest::get("/meetings.yaml").await?.text().await?;

    let config: MeetingsConfig = serde_yaml::from_str(&response_text)?;

    // Validate the config structure
    if config.meetings.is_empty() {
        return Err("Invalid meetings configuration: meetings array is required".into());
    }

    // Validate each meeting has required fields
    for (index, meeting) in config.meetings.iter().enumerate() {
        if meeting.id == 0 || meeting.title.is_empty() || meeting.presenter.is_empty()
            || meeting.date.is_empty() || meeting.description.is_empty() || meeting.room.is_empty() {
            return Err(format!("Invalid meeting at index {}: missing required fields", index).into());
        }
    }

    Ok(config)
}
