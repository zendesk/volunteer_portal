module Types
    class LanguageGraphType < Types::BaseObject
      graphql_name 'Language'
      description 'Supported languages'
  
      implements GraphQL::Relay::Node.interface
      global_id_field :gid
  
      field :id, ID, null: false
      field :language_code, String, null: false
      field :language_name, String, null: false

    end
  end
  