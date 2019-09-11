require_relative '../../test_helper'

SingleCov.covered!

describe RecordLoader do
  let(:office) { offices(:san_francisco) }
  let(:remote_office) { offices(:remote) }

  it 'loads all records' do
    offices = GraphQL::Batch.batch do
      RecordLoader.for(Office).load_many([office.id, remote_office.id])
    end

    offices.map(&:id).sort.must_equal [office.id, remote_office.id].sort
  end

  it 'uses the where clause when passed in' do
    offices = GraphQL::Batch.batch do
      RecordLoader.for(Office, where: { name: office.name }).load_many([office.id, remote_office.id])
    end

    offices.compact.map(&:id).must_equal [office.id]
  end
end
