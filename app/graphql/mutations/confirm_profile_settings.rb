module Mutations
  class ConfirmProfileSettings < BaseMutation
    description 'Sets user preference confirmed profile settings to true'

    null true

    def resolve()
      UserPreferenceResolver.confirm_profile_settings(context)
    end
  end
end
