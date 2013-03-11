class Survei < ActiveRecord::Base
  self.table_name = 'survei'

  belongs_to :user

  validates_presence_of :user_id, :skill_level, :bahasa_pemograman, :cita_cita, :minat_lain, :message => "Harus diisi"
end
