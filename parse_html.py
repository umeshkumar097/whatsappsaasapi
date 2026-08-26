from bs4 import BeautifulSoup

with open('/Users/aiclex/.gemini/antigravity/brain/f9548e66-8ef8-48e8-859c-6cc4a81eaf56/.system_generated/steps/2956/content.md', 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')
    print(soup.get_text(separator=' ', strip=True)[:3000])
