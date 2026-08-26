import pexpect
import sys

child = pexpect.spawn('npx drizzle-kit push', encoding='utf-8')
child.logfile = sys.stdout

while True:
    try:
        index = child.expect(['Is message_rates table created or renamed', 'Is wallets table created or renamed', 'Is wallet_transactions table created or renamed', pexpect.EOF, pexpect.TIMEOUT], timeout=30)
        
        if index == 0 or index == 1 or index == 2:
            # It's asking if it's created or renamed. The default is "create table", which is what we want.
            # We just need to send Enter.
            child.sendline('')
        elif index == 3:
            print("Finished successfully.")
            break
        elif index == 4:
            print("Timeout reached.")
            break
    except Exception as e:
        print("Error:", e)
        break

child.close()
sys.exit(child.exitstatus)
