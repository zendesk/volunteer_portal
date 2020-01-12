module UserPreferenceResolver
  class << self

    def confirm_profile_settings(context)
      preference = UserPreference.find_or_create_by(user: context[:current_user])
      preference.confirmed_profile_settings = true
      preference.save!

      preference
    end
  end
end
