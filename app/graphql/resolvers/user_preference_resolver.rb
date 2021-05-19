module UserPreferenceResolver
  class << self
    def confirm_profile_settings(context)
      preference = UserPreference.find_or_create_by(user: context[:current_user])
      preference.confirmed_profile_settings = true
      preference.save!

      preference
    end

    def update_user_language_preference(_, args, context)
      language_id = args[:id]
      current_user_id = context[:current_user].id

      user_preference = UserPreference.find_or_create_by(user_id: current_user_id)
      user_preference.update(language_id: language_id)

      { id: language_id }
    end
  end
end
