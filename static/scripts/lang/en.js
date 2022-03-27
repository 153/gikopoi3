export default
{
    lang_name: "English",
    default_user_name: "Anonymous",
    message_colon: ": ",
    test: "test",
    ui:
    {
        title: "Gikopoipoi",
        subtitle: "Unofficial remake",
        
        login_user_count: "Users: ",
        login_streamer_count: "Streamers: ",
        
        infobox_label_area: "Area:",
        infobox_label_room: "Stage:",
        infobox_label_user_name: "Name:",
        infobox_label_user_count: "Users:",
        infobox_label_stream_count: "Streams:",
        
        label_username: "User name:",
        label_stream: "Channel {index}: ",
        label_input: "Input:",
        label_log: "Log:",

        button_send: "Send",
        button_stream_start: "Start stream",
        button_stream_stop: "Stop stream",
        button_stream_take: "Get stream",
        button_stream_drop: "Drop stream",
        button_rula: "#rula",
        button_list: "#list",
        button_preferences: "Preferences",
        button_logout: "Logout",
        volume: "Volume: ",
        enable_compression: "Boost: ",
        sound_effect: "Volume",
        tts_volume: "TTS Vol.",
        label_move: "Move",
        label_bubble: "Bubble",
        
        popup_button_ok: "OK",
        popup_button_cancel: "Cancel",
        
        warning_toast_title: "Warning",
        
        rula_menu_title: "Stage Info",
        rula_menu_column_room_name: "Stage Name",
        rula_menu_column_user_count: "Users",
        rula_menu_column_streamers: "Streamers",
        rula_menu_button_rula: "Rula",
        rula_menu_label_group: "Area",
        rula_menu_group_option_all: "All",

        user_list_popup_title: "User List (total: @USER_COUNT@)",
        user_list_popup_column_user_name: "User name",
        user_not_in_room: "This user is not in this room.",
        user_inactive: "This user is inactive.",
        user_list_popup_ignore: "Ignore",
        user_list_popup_unignore: "Unignore",
        user_list_popup_block: "Block",
        user_list_popup_close: "Close",
        user_list_popup_blurb: "Warning: When you ignore a user, you will not see them, but they will still see you.<br>When you block a user, he'll stay blocked even if he reconnects.",
        
        stream_form_title: "Stream Settings",
        stream_form_mode: "Mode:",
        stream_form_video_sound_mode: "Video + Voice",
        stream_form_sound_only_mode: "Voice only",
        stream_form_video_only_mode: "Video only",
        stream_form_show_advanced: "Show Advanced Settings",
        stream_form_hide_advanced: "Hide Advanced Settings",
        stream_form_echo_cancellation: "Echo Cancellation",
        stream_form_noise_suppression: "Noise Reduction",
        stream_form_auto_gain: "Auto Gain Control",
        stream_form_button_stream: "Start Streaming",
        stream_form_screen_capture: "Screen Capture",
        stream_form_screen_capture_audio: "Screen Capture Audio",
        stream_form_screen_capture_audio_notice: "This feature is experimental. Chrome and Edge only. \nOn Windows, only the screen audio or tab audio can be captured.",

        device_selection_title: "Select device",
        device_selection_audio_devices: "Audio devices",
        device_selection_video_devices: "Video devices",
        
        preferences_title: "Preferences",
        preferences_name_bg: "Show Username Background",
        preferences_shift_enter: "Newline On Shift+Enter",
        preferences_bubble_opacity: "Speech Bubble Opacity",
        preferences_dark_mode: "Shaddox Mode",
        preferences_command_section_visible: "Display Command Buttons",
        preferences_move_section_visible: "Display Move Buttons",
        preferences_bubble_section_visible: "Display Bubble Buttons",
        preferences_logout_button_visible: "Display Logout Button",
        preferences_show_notifications: "Show Desktop Notifications",
        preferences_enable_text_to_speech: "Enable",
        preferences_tts_voice: "Voice",
        preferences_tts_voice_automatic: "Automatic",
        preferences_tts_voice_animalese: "Animalese",
        notifications_are_denied: "This site is currently not permitted to show notifications.\nPlease check your browser's permissions.",
        preferences_title_general: "General",
        preferences_title_game: "Game",
        preferences_title_toolbar: "Toolbar",
        preferences_title_tts: "Text-to-Speech",
        preferences_title_notifications: "Notifications",
        preferences_message_sound_enabled: "Message Sound",
        preferences_login_sound_enabled: "Login Sound",
        preferences_name_mention_sound_enabled: "Username Mention Sound",
        preferences_custom_mention_sound_pattern: "Custom Mention Sound Pattern",
        preferences_custom_mention_sound_notice: "Comma separated words or Regex.\nMessages that include the words or match the Regex trigger the mention sound.",
        preferences_underlined_usernames: "Underline Usernames",
        preferences_low_quality: "Low Quality",
        preferences_crisp_mode: "Crisp",
        preferences_timestamps_in_copied_log: "Include timestamps in copied logs",
        preferences_ignore_indicator_in_log: "Show in the log an indicator in place of the messages by ignored users",
        preferences_language: "Language",
        preferences_enable_coin_sound: "SFX Sounds",

        preferences_title_streams: "Streams",
        preferences_streams_auto_resume: "Auto resume",
        preferences_streams_inbound_vu_meter_enabled: "Display VU meter for received streams",
        preferences_title_chat: "Chat",
        preferences_clear_log: "Clear chat log",

        back_to_homepage: "Go back to home page",

        chess_slot_title: "Chess",
        chess_waiting_for_white: "Waiting for white to join...",
        chess_waiting_for_black: "Waiting for black to join...",
        chess_white: "White: ",
        chess_black: "Black: ",
        chess_display_game: "Display game",
        chess_hide_game: "Hide game",
        chess_join_game: "Join game",
        chess_quit_game: "Quit game",
    },
    msg:
    {
        no_other_users_in_this_room: "There are no other users in this room!",
        connection_lost: "Reconnecting...",
        connection_refused: "Connection Lost, please refresh the page.",
        page_refresh_required: "An update is ready, so please refresh this page.",
        
        error_obtaining_media: "Unable to obtain media. Please check the browser permissions.",
        error_obtaining_video: "Unable to obtain video. Please check the browser permissions.",
        error_obtaining_audio: "Unable to obtain audio. Please check the browser permissions.",
        no_webrtc: "Sorry, your browser doesn't support WebRTC.",
        error_didnt_select_device: "Please select a device.",
        
        unknown_error: "The connection failed due to an unknown error.",
        invalid_username: "The provided username is invalid.",
        ip_restricted: "You are already logged in twice with this IP address.",
        start_stream_stream_slot_already_taken: "Someone else is already streaming in this slot.",
        start_stream_stream_slot_already_taken_by_blocked_streamer: "Someone who you are blocking is already streaming in this slot.",
        start_stream_stream_slot_already_taken_by_blocking_streamer: "Someone who has blocked you is already streaming in this slot.",
        start_stream_unknown_error: "Unable to start streaming.",
        are_you_sure_you_want_to_logout: "Are you sure you want to logout?",
        are_you_sure_you_want_to_block: "Are you sure you want to block this user?",
        goodbye: "See you soon!",
        flood_warning: "Hey, aren't you talking a bit too fast? Undelivered message: ",
        chess_timeout_reached: "The chess game is over: timeout reached.",
        chess_win: "The chess game is over: the winner is @USER_NAME@.",
        chess_quit: "The chess game is over: @USER_NAME@ quit the game.",
        
        are_you_sure_you_want_to_clear_log: "Are you sure you want to clear the chat log?",
        chat_log_cleared: "The chat log has been cleared.",
    },
    room:
    {
        long_st: "Eel Track", // Eel road/way/alley
        jinja: "Shrine",
        jinja_st: "Shrine Entrance",
        school_ground: "School: Schoolyard",
        bar774: "Underground Town: Bar 774",
        izakaya774: "Underground Town: Drunker's Bar", // Izakaya Anonymous
        basement: "Underground Town",
        bar: "Bar",
        school_st: "School Crossing", // School street
        bar_st: "Bar Street",
        admin_st: "Kanrinin Street", // Development Bureau/Department Street
        admin: "Developer's Lounge", // Development Bureau/Department
        admin_bar: "Admin's Bar", // Secret bar
        cafe_st: "Cafe Vista", // Cafe street
        enkai: "Banqueting Hall",
        idoA: "Well A",
        idoB: "Well B",
        busstop: "Bus Stop",
        school: "School: Classroom",
        school_rouka: "School: Hallway",
        school_international: "School: Cultural Room", // International classroom
        school_pc: "School Computer Lab",
        seashore: "Seashore",
        radio: "Radio Studio", // Radio station
        radio_room1: "Radio Studio 1", // Radio station studio 1
        radio_room2: "Radio Studio 2: BEAT GIKO", // Radio station studio 2 BEAT GIKO
        radio_room3: "Radio Studio 3: G-SQUID",
        radio_gakuya: "Radio Studio: Dressing Room",
        radio_backstage: "Radio Studio: Greenroom", // Backstage/Behind the scenes/offstage
        yatai: "Sushi Vendor", // (Ramen) vendor/stand/stall/food cart
        kaidan: "Hilltop Stairway",
        takadai: "Hilltop", // High ground/elevation
        yoshinoya: "Yoshinoya",
        silo: "Silo",
        badend: "You fell to your death!",
        bar_giko: "Bar Giko",
        bar_giko2: "Bar Giko Lower Floor",
        bar_giko_square: "Fountain Plaza",
        densha: "Train",
        monachat: "Monachat",
        konbini: "Convenience Store",
        nerd_office: "Hacker Office",
    },
    area:
    {
        gikopoipoi: "Gikopoipoi",
        gikopoi: "Sea City",
        bar_giko: "Bar Giko Town",
    }
}