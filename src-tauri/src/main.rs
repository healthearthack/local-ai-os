
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Runtime};

#[cfg(target_os = "windows")]
use windows::Win32::{
    Foundation::HWND,
    UI::WindowsAndMessaging::{GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_LAYERED, WS_EX_TRANSPARENT},
};

#[cfg(target_os = "windows")]
fn set_click_through<R: Runtime>(app: &tauri::AppHandle<R>, enable: bool) {
  if let Some(window) = app.get_window("main") {
    if let Ok(raw_handle) = window.hwnd() {
      unsafe {
        let hwnd = HWND(raw_handle.0 as isize);
        let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
        if enable {
          SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex_style | (WS_EX_LAYERED.0 as isize) | (WS_EX_TRANSPARENT.0 as isize));
        } else {
          // remove WS_EX_TRANSPARENT, keep others
          SetWindowLongPtrW(
            hwnd,
            GWL_EXSTYLE,
            ex_style & !(WS_EX_TRANSPARENT.0 as isize),
          );
        }
      }
    }
  }
}

#[tauri::command]
fn set_click_through_cmd<R: Runtime>(app: tauri::AppHandle<R>, enable: bool) {
  #[cfg(target_os = "windows")]
  set_click_through(&app, enable);
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![set_click_through_cmd])
    .setup(|app| {
      // Enable click-through by default (Windows only)
      #[cfg(target_os = "windows")]
      set_click_through(app, true);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
