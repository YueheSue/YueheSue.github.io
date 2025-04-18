from playwright.sync_api import sync_playwright

def auto_fill_webpage():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to webpage
        page.goto('YOUR_WEBPAGE_URL')

        # Fill form fields (customize selectors and values as needed)
        page.fill('input#username', 'your_username')  # Replace selector and value
        page.fill('input#password', 'your_password')  # Replace selector and value
        
        # Example of filling other common form elements
        page.select_option('select#dropdown', 'option_value')  # For dropdowns
        page.check('input#checkbox')  # For checkboxes
        page.click('input[type="radio"]')  # For radio buttons
        
        # Submit form
        page.click('button[type="submit"]')
        
        # Wait for navigation or response
        page.wait_for_load_state('networkidle')
        
        # Take screenshot (optional)
        page.screenshot(path="filled_form.png")
        
        # Close browser
        browser.close()

def auto_fill_webpage_test():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Navigate to webpage
        # page.goto('https://cloud.cwikin.com/2025zs/')
        # page.goto('https://cloud.cwikin.com/pc/#/login')
        page.goto('http://www.cwikids.cn/site/login')

        # Get page title
        title = page.title()
        print(f"Page title: {title}")

        # Get current URL
        url = page.url
        print(f"Current URL: {url}")

        # Get page content
        # Extract all text content from the page
        text_content = page.evaluate('() => document.body.innerText')
        # print(f"Text content: {text_content}")

        # Split into words and print word count
        words = text_content.split()
        print(f"Number of words: {len(words)}")
        print("Words found:", words)


        content = page.content()
        # print(f"Page content: {content}")
        print(f"Page content length: {len(content)} characters")

        # Get all links on the page
        links = page.eval_on_selector_all('a', 'elements => elements.map(el => el.href)')
        print(f"Number of links found: {len(links)}")

        # Get meta description
        meta_desc = page.eval_on_selector('meta[name="description"]', 'el => el.content') if page.query_selector('meta[name="description"]') else 'No meta description found'
        print(f"Meta description: {meta_desc}")

        # Find all input fields and their labels/placeholders
        # input_fields = page.query_selector_all('input')
        # for field in input_fields:
        #     # Get various attributes that might contain field names/labels
        #     placeholder = page.evaluate('(element) => element.placeholder', field) or ''
        #     name = page.evaluate('(element) => element.name', field) or ''
        #     id = page.evaluate('(element) => element.id', field) or ''
        #     label = page.evaluate('(element) => element.labels[0].textContent', field) or ''
            
        #     # Get associated label text if any
        #     label = page.evaluate('''(element) => {
        #         const label = element.labels ? element.labels[0] : null;
        #         return label ? label.textContent : '';
        #     }''', field) or ''
            
        #     print(f"Field found:")
        #     print(f"  Placeholder: {placeholder}")
        #     print(f"  Name: {name}")
        #     print(f"  ID: {id}")
        #     print(f"  Label: {label}")
        #     print("---")
        
        # Find fields by their associated label text
        def find_field_by_label(page, label_text):
            # Use JavaScript to find input field with matching label
            field = page.evaluate(f'''() => {{
                const labels = Array.from(document.getElementsByTagName('label'));
                for (const label of labels) {{
                    if (label.textContent.includes('{label_text}')) {{
                        return label.control || label.getAttribute('for');
                    }}
                }}
                return null;
            }}''')
            return field

        # Example usage:
        username_field = find_field_by_label(page, "用户名")
        if username_field:
            print(f"Found username field with id: {username_field}")
        else:
            print("Username field not found")

        # page.get_by_label("用户名").fill("cutebaby")

        # # Fill form fields (customize selectors and values as needed)
        # page.fill('username', 'cutebaby')  # Replace selector and value
        # page.fill('password', 'justatest')  # Replace selector and value

        # page.fill('input[aria-label="用户名"]', 'cutebaby')  # Replace selector and value
        # page.fill('input[aria-label="密码"]', 'justatest')  # Replace selector and value

        # Print all labels and their associated input fields
        labels = page.query_selector_all('label')
        for label in labels:
            text = page.evaluate('el => el.textContent', label)
            for_attr = page.evaluate('el => el.getAttribute("for")', label)
            print(f"Label text: {text}, For attribute: {for_attr}")

        # Fill form fields based on label text
        # username_field = find_field_by_label(page, "用户名")
        # if username_field:
        #     page.fill('[name="username"]', 'cutebaby')
        
        # password_field = find_field_by_label(page, "密码")
        # if password_field:
        #     page.fill('[name="password"]', 'justatest')
        
        # # Submit the form - look for a submit button
        # submit_button = page.evaluate('''() => {
        #     // Try finding submit button through various common patterns
        #     const submitSelectors = [
        #         'button[type="submit"]',
        #         'input[type="submit"]',
        #         'button:has-text("登录")',
        #         'button:has-text("提交")',
        #         'input[value="登录"]',
        #         'input[value="提交"]'
        #     ];
            
        #     for (const selector of submitSelectors) {
        #         const element = document.querySelector(selector);
        #         if (element) return selector;
        #     }
        #     return null;
        # }''')
        
        # if submit_button:
        #     page.click(submit_button)
        #     page.wait_for_load_state('networkidle')
        
        # # Example of filling other common form elements
        # page.select_option('select#dropdown', 'option_value')  # For dropdowns
        # page.check('input#checkbox')  # For checkboxes
        # page.click('input[type="radio"]')  # For radio buttons
        
        # # Submit form
        # page.click('button[type="submit"]')
        
        # # Wait for navigation or response
        # page.wait_for_load_state('networkidle')
        
        # Take screenshot (optional)
        page.screenshot(path="filled_form.png")
        
        # Close browser
        # browser.close()


if __name__ == "__main__":
    auto_fill_webpage_test()
