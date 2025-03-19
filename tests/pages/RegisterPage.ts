import { Page } from "@playwright/test";
import BasePage from "./BasePage";

const REGISTER_FORM = {
  loginLabel: "label[for=user_login]",
  passwordLabel: "label[for=user_password]",
  passwordConfirmationLabel: "label[for=user_password_confirmation]",
  firstNameLabel: "label[for=user_firstname]",
  lastNameLabel: "label[for=user_lastname]",
  loginField: "#user_login",
  passwordField: "#user_password",
  passwordConfirmationField: "#user_password_confirmation",
  firstNameField: "#user_firstname",
  lastNameField: "#user_lastname",
  emailField: "#user_mail",
  hideEmailCheckbox: "#pref_hide_mail",
  languageSelector: "#user_language",
  organizationField: "#user_custom_field_values_5",
  locationField: "#user_custom_field_values_6",
  ircField: "#user_custom_field_values_3",
  submitButton: "input[type=submit]",
};

const REGISTER_MESSAGES = {
  errorMessage: "div#errorExplanation > ul > li",
};

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get loginField() {
    return this.getElement(REGISTER_FORM.loginField);
  }

  public get passwordField() {
    return this.getElement(REGISTER_FORM.passwordField);
  }

  public get passwordConfirmationField() {
    return this.getElement(REGISTER_FORM.passwordConfirmationField);
  }

  public get firstNameField() {
    return this.getElement(REGISTER_FORM.firstNameField);
  }

  public get lastNameField() {
    return this.getElement(REGISTER_FORM.lastNameField);
  }

  public get emailField() {
    return this.getElement(REGISTER_FORM.emailField);
  }

  public get hideEmailCheckbox() {
    return this.getElement(REGISTER_FORM.hideEmailCheckbox);
  }

  public get languageSelector() {
    return this.getElement(REGISTER_FORM.languageSelector);
  }

  public get organizationField() {
    return this.getElement(REGISTER_FORM.organizationField);
  }

  public get locationField() {
    return this.getElement(REGISTER_FORM.locationField);
  }

  public get ircField() {
    return this.getElement(REGISTER_FORM.ircField);
  }

  public get submitButton() {
    return this.getElement(REGISTER_FORM.submitButton);
  }

  public async fillRegistrationForm(
    login: string,
    password: string,
    passwordConfirmation: string,
    firstName: string,
    lastName: string,
    email: string,
    hideEmail: boolean,
    organization: string,
    location: string,
    irc: string
  ): Promise<void> {
    await this.loginField.fill(login);
    await this.passwordField.fill(password);
    await this.passwordConfirmationField.fill(passwordConfirmation);
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    if (hideEmail) {
      await this.hideEmailCheckbox.check();
    }
    await this.organizationField.fill(organization);
    await this.locationField.fill(location);
    await this.ircField.fill(irc);
  }

  public async fillLoginField(login: string): Promise<void> {
    await this.loginField.fill(login);
  }

  public async fillPasswordField(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  public async fillPasswordConfirmationField(password: string): Promise<void> {
    await this.passwordConfirmationField.fill(password);
  }

  public async fillFirstNameField(firstName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
  }

  public async fillLastNameField(lastName: string): Promise<void> {
    await this.lastNameField.fill(lastName);
  }

  public async fillEmailField(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  public async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  public get errorMessage() {
    return this.getElement(REGISTER_MESSAGES.errorMessage);
  }

  public get loginLabel() {
    return this.getElement(REGISTER_FORM.loginLabel);
  }

  public get passwordLabel() {
    return this.getElement(REGISTER_FORM.passwordLabel);
  }

  public get passwordConfirmationLabel() {
    return this.getElement(REGISTER_FORM.passwordConfirmationLabel);
  }

  public get firstNameLabel() {
    return this.getElement(REGISTER_FORM.firstNameLabel);
  }

  public get lastNameLabel() {
    return this.getElement(REGISTER_FORM.lastNameLabel);
  }
}
