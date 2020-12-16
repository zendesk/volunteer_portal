class CreateLanguageTable < ActiveRecord::Migration[5.2]
  def change
    create_table :languages do |t|
      t.string :language_code
    end

    add_index :languages, :language_code, unique: true

    return unless Language.all.length.zero?

    [
      'en', 'es', 'ja'
    ].each { |language| Language.find_or_create_by(language_code: language) }
  end
end
