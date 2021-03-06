"""empty message

Revision ID: d98d534f24b9
Revises: b50bca001cf2
Create Date: 2020-06-16 06:39:28.876123

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd98d534f24b9'
down_revision = 'b50bca001cf2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('timetable', 'accepted')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('timetable', sa.Column('accepted', sa.BOOLEAN(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
