from tkinter import Tk, filedialog
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key='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')

# Create a Tkinter root window
root = Tk()
root.withdraw()  # Hide the root window

# Ask user to select the audio file
audio_file_path = filedialog.askopenfilename(title="Select Audio File", filetypes=(("Audio files", "*.mp3"), ("All files", "*.*")))

if audio_file_path:
    # Open the selected audio file
    with open(audio_file_path, "rb") as audio_file:
        # Call the transcription API
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            prompt="Don't miss anything in the audio containing doctor dictations. Sometimes the audio contains Urdu/Hindi words, make sure to convert them to English."
        )
        # Get the transcript text
        transcript_text = transcription.text

    # Write the transcript text to a Notepad file
    with open("transcript.txt", "w") as file:
        file.write(transcript_text)

    print("Transcript has been written to transcript.txt")
else:
    print("No audio file selected.")