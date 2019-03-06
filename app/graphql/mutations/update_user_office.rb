module Mutations
  class UpdateUserOffice < BaseMutation
    description 'Update the office of the current user object'

    null true

    argument :user_id,   ID, required: true
    argument :office_id, ID, required: true

    def resolve(user_id:, office_id:)
      user = User.find(user_id)
      office = Office.find(office_id)
      user.office = office
      user.save!
      user
    end
  end
end
