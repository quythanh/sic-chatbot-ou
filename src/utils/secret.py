import os
import hashlib

def generate_secret_key():
    random_bytes = os.urandom(32)
    secret_key = hashlib.sha256(random_bytes).hexdigest()
    return secret_key
