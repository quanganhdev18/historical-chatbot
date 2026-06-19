import asyncio
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPER_MODEL_PATH = os.path.join(BASE_DIR, "models", "vi_VN-vais1000-medium.onnx")
PIPER_EXE = os.path.join(os.path.dirname(sys.executable), "piper.exe")

async def test():
    try:
        print(f"Executing: {PIPER_EXE}")
        print(f"Model path: {PIPER_MODEL_PATH}")
        process = await asyncio.create_subprocess_exec(
            PIPER_EXE, "--model", PIPER_MODEL_PATH, "--output_file", "-",
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout_data, stderr_data = await process.communicate(input=b"Chao ban")
        print(f"Return code: {process.returncode}")
        if process.returncode != 0:
            print(f"Stderr: {stderr_data.decode('utf-8')}")
        else:
            print(f"Stdout length: {len(stdout_data)}")
    except Exception as e:
        print(f"Piper exception: {repr(e)}")

asyncio.run(test())
