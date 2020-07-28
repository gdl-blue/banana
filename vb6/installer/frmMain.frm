VERSION 5.00
Begin VB.Form frmMain 
   BorderStyle     =   1  '단일 고정
   Caption         =   "바나나 설치 프로그램"
   ClientHeight    =   5640
   ClientLeft      =   45
   ClientTop       =   345
   ClientWidth     =   7440
   Icon            =   "frmMain.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   Picture         =   "frmMain.frx":0442
   ScaleHeight     =   5640
   ScaleWidth      =   7440
   StartUpPosition =   2  '화면 가운데
   Begin VB.TextBox txtSkin 
      Height          =   270
      IMEMode         =   3  '사용 못함
      Left            =   1920
      PasswordChar    =   "*"
      TabIndex        =   10
      Top             =   2520
      Width           =   4335
   End
   Begin VB.TextBox txtSecret 
      Height          =   270
      IMEMode         =   3  '사용 못함
      Left            =   1920
      PasswordChar    =   "*"
      TabIndex        =   6
      Top             =   2040
      Width           =   4335
   End
   Begin VB.TextBox txtPort 
      Height          =   270
      Left            =   1920
      TabIndex        =   4
      Text            =   "80"
      Top             =   1560
      Width           =   4335
   End
   Begin VB.TextBox txtHost 
      Height          =   270
      Left            =   1920
      TabIndex        =   2
      Text            =   "127.0.0.1"
      Top             =   1080
      Width           =   4335
   End
   Begin VB.CommandButton cmdInstall 
      Caption         =   "시 작 !"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   2880
      TabIndex        =   0
      Top             =   4920
      Width           =   1695
   End
   Begin VB.Label Label7 
      BackStyle       =   0  '투명
      Caption         =   "기 본   스 킨 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   11
      Top             =   2520
      Width           =   1455
   End
   Begin VB.Label Label6 
      BackStyle       =   0  '투명
      Caption         =   $"frmMain.frx":397E
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   600
      TabIndex        =   9
      Top             =   3960
      Width           =   6255
   End
   Begin VB.Label Label5 
      BackStyle       =   0  '투명
      Caption         =   $"frmMain.frx":3A58
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   600
      TabIndex        =   8
      Top             =   3360
      Width           =   6255
   End
   Begin VB.Label Label4 
      Alignment       =   2  '가운데 맞춤
      BackStyle       =   0  '투명
      Caption         =   "엔 진   설 치 를   시 작 합 니 다 .   정 보 를    정 확 히    입 력 해 주 세 요 ~ ^^"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   7
      Top             =   360
      Width           =   6855
   End
   Begin VB.Label Label3 
      BackStyle       =   0  '투명
      Caption         =   "세 션   비밀  키 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   5
      Top             =   2040
      Width           =   1455
   End
   Begin VB.Label Label2 
      BackStyle       =   0  '투명
      Caption         =   "포 트 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   3
      Top             =   1560
      Width           =   1455
   End
   Begin VB.Label Label1 
      BackStyle       =   0  '투명
      Caption         =   "호 스 트  주 소 :"
      BeginProperty Font 
         Name            =   "돋움"
         Size            =   9
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   360
      TabIndex        =   1
      Top             =   1080
      Width           =   1455
   End
End
Attribute VB_Name = "frmMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim iscomplete As Boolean

Private Sub cmdInstall_Click()
    If txtHost.Text = "" Or txtPort.Text = "" Or txtSecret.Text = "" Or txtSkin.Text = "" Then
        MsgBox "모든 칸들을 채워주세요~", 16, "오류"
        Exit Sub
    End If

    iscomplete = True
    
    'https://stackoverflow.com/questions/21108664/how-to-create-txt-file
    Dim iFileNo As Integer
    iFileNo = FreeFile
    Open "config.json" For Output As #iFileNo
    Print #iFileNo, "{"
    Print #iFileNo, "    " & ChrW$(34) & "host" & ChrW$(34) & ": " & ChrW$(34) & txtHost.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "port" & ChrW$(34) & ": " & ChrW$(34) & txtPort.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "initialized" & ChrW$(34) & ": false, "
    Print #iFileNo, "    " & ChrW$(34) & "skin" & ChrW$(34) & ": " & ChrW$(34) & txtSkin.Text & ChrW$(34) & ", "
    Print #iFileNo, "    " & ChrW$(34) & "secret" & ChrW$(34) & ": " & ChrW$(34) & txtSecret.Text & ChrW$(34)
    Print #iFileNo, "}"
    Close #iFileNo
    
    Shell "cmd /c start node server.js"
    
    End
End Sub

Private Sub Form_Load()
    iscomplete = False
End Sub

Private Sub Form_Unload(Cancel As Integer)
    If MsgBox("설치를 취소하시겠습니까? --; 세션 키에 비밀번호를 적고 설치를 누르고 처리될 때까지 기다리시고 127.0.0.1에 접속하면 당신의 위키가 만들어집니다 ^^", vbOKCancel + vbExclamation, "확인") = vbOK Then
        End
    Else
        Cancel = 1
    End If
End Sub

