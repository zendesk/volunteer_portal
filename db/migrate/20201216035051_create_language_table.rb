class CreateLanguageTable < ActiveRecord::Migration[5.2]
  def change
    create_table :languages do |t|
      t.string :language_code
      t.string :language_name
    end

    add_index :languages, :language_code, unique: true

    return unless Language.all.length.zero?

    [
      ['en', 'English'], ['es', 'Español'], ['ja', '日本語']
    ].each { |language| Language.create_with(language_code: language[0]).find_or_create_by(language_name: language[1]) }
  end
end
