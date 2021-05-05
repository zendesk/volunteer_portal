module Mutations
    class UpdateUserLanguagePreference < BaseMutation
      description 'Sets user language preference'

      null true

      argument :id, ID, required: true

      def resolve(**args)
        UserPreferenceResolver.update_user_language_preference(object, args, context)
      end
    end
  end
  