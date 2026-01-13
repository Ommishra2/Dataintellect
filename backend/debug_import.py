import sys
import os

print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")

try:
    import main
    print("Successfully imported main")
except Exception as e:
    print(f"Failed to import main: {e}")
    import traceback
    traceback.print_exc()
