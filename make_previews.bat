@echo off
@chcp 1251

rem ===========================================================================
rem Создает серию файлов с плитками миниатюр видео.
rem ===========================================================================

set FFMPEG="ffmpeg.exe"
set INPUT="D:\ffmpeg\in_BigBuckBunny_h264.mp4"
set STEP=10
set PREVIEW_ROW=5
set PREVIEW_COLUMN=5
set PREVIEW_SIZE=158:90

%FFMPEG% ^
    -y ^
    -hide_banner ^
    -loglevel level ^
    ^
    -i %INPUT% ^
    ^
    -an ^
    -vsync passthrough ^
    -filter_complex "select=expr=isnan(prev_selected_t)+gte(t-prev_selected_t\,10),scale=%PREVIEW_SIZE%,tile=%PREVIEW_COLUMN%x%PREVIEW_ROW%" ^
    preview_%%d.png
    
pause   
