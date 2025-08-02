// Run this on every page load
document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById('theme');

    // Load saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    const languageSelect = document.getElementById('language');

    // Load saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLanguage;
    applyLanguage(savedLanguage);

    themeSelect.addEventListener('change', actionTheme);

    languageSelect.addEventListener('change', actionLanguage)


});

function actionTheme(event) {
    const selectedTheme = event.target.value;
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
}

function actionLanguage(event) {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    applyLanguage(selectedLanguage);
}

async function formResetPassword() {
    const formHTML = await loadHtmlComponent('../../../components/built/form/form.html');

    formHTML.querySelector('#form_title').textContent = t('reset_password');
    formHTML.querySelector('#form_message').remove();

    replaceText(formHTML,'#form_item_1_label',t('old_password'));
    replaceText(formHTML,'#form_item_2_label',t('new_password'));
    replaceText(formHTML,'#form_item_3_label',t('repeat_new_password'));

    formHTML.querySelector('#form_item_1_input').setAttribute('type','password');
    formHTML.querySelector('#form_item_2_input').setAttribute('type','password');
    formHTML.querySelector('#form_item_3_input').setAttribute('type','password');
    formHTML.querySelector('#form_item_4_input').remove();
    formHTML.querySelector('#form_item_4_label').remove();
    formHTML.querySelector('#form_item_5_input').remove();
    formHTML.querySelector('#form_item_5_label').remove();
    formHTML.querySelector('#need_help_box_now').remove();

    formHTML.querySelector('#form_back_button').addEventListener('click', (event) => {
        event.preventDefault();
        formHTML.remove();
    });

    formHTML.querySelector('.form').addEventListener('submit', async (event) => {
        event.preventDefault();
        await resetPassword(formHTML);

    });

    document.body.append(formHTML);

    // Apply custom input styling (assumed external function)
    customInputCheck('.form input');
}

async function resetPassword(formHTML) {
    const formData = new FormData();
    formData.append('old_password', formHTML.querySelector('#form_item_1_input').value.trim());
    formData.append('new_password', formHTML.querySelector('#form_item_2_input').value.trim());
    formData.append('repeat_new_password', formHTML.querySelector('#form_item_3_input').value.trim());

    if(formData.get('new_password') !== formData.get('repeat_new_password')) {
        await showNotification(t('password_should_match'), "error")
        return;
    }

    formData.append('action','reset_password');

    await fetch('../../../include/profile/profile.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json()) // Parse response as JSON
        .then(async data => {
            if (data.response === "Done") {
                await showNotification(t('password_change_success'), 'success');
                formHTML.remove();
            } else {
                await showNotification(data.response, 'error');
            }
        })

}